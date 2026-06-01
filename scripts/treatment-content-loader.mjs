/** Stub image/asset imports when loading treatmentContent.ts from Node. */
export async function resolve(specifier, context, nextResolve) {
  if (/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(specifier)) {
    return {
      url: "data:text/javascript,export default ''",
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
