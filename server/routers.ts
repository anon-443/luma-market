import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { PRODUCT_CATALOG, normalizeAISearchResponse } from "./catalog";
import { createProductReview, listProductReviews } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const productIdSchema = z.object({ productId: z.number().int().refine(id => PRODUCT_CATALOG.some(product => product.id === id), "Unknown product") });

const catalogContext = PRODUCT_CATALOG.map(product => `${product.id}. ${product.name} — ${product.vendor}; ${product.category}; ${product.description}; inventory: ${product.inventoryStatus === "lowStock" ? `low stock (${product.remaining} remaining)` : `${product.remaining} available`}.`).join("\n");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  discovery: router({
    suggest: publicProcedure.input(z.object({ query: z.string().trim().min(3).max(240), history: z.array(z.string().trim().min(3).max(240)).max(5).optional() })).mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          model: "gemini-3-flash-preview",
          maxTokens: 1024,
          messages: [
            { role: "system", content: "You are Luma Market's precise product finder. Always select at least one and up to four relevant IDs only from the supplied catalog. Interpret descriptive shopping language, such as mood, material, room, or use case. Consider live inventory: make currently well-stocked relevant choices first, and clearly flag a low-stock match only when it is a particularly strong fit. Do not invent products or attributes." },
            { role: "user", content: `Catalog:\n${catalogContext}\n\nRecent visitor search themes: ${(input.history ?? []).join(" | ") || "None yet"}\n\nVisitor search: ${input.query}` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "marketplace_product_suggestions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  productIds: { type: "array", items: { type: "integer" }, minItems: 1, maxItems: 4 },
                  shortReason: { type: "string", minLength: 1, maxLength: 180 },
                  inventoryNote: { type: "string", minLength: 1, maxLength: 130 },
                },
                required: ["productIds", "shortReason", "inventoryNote"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        const rawContent = typeof content === "string" ? content : "";
        const suggestion = normalizeAISearchResponse(rawContent, input.query);
        console.info(`[AI discovery] ${suggestion.source} suggestion returned for ${input.query.length}-character query`);
        return suggestion;
      } catch (error) {
        console.warn("[AI discovery] Falling back to catalog matching", error);
        return normalizeAISearchResponse("", input.query);
      }
    }),
  }),
  reviews: router({
    list: publicProcedure.input(productIdSchema).query(({ input }) => listProductReviews(input.productId)),
    create: publicProcedure.input(productIdSchema.extend({
      authorName: z.string().trim().min(2).max(80),
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().min(4).max(1000),
    })).mutation(async ({ input }) => {
      await createProductReview(input);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
