module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  return root
    .find(j.TSPropertySignature, { optional: true })
    .forEach(({ node }) => {
      if (
        !j.TSUnionType.check(node.typeAnnotation.typeAnnotation) ||
        !node.typeAnnotation.typeAnnotation.types.some(
          (t) => t.type === "TSUndefinedKeyword"
        )
      ) {
        node.typeAnnotation.typeAnnotation = j.tsUnionType([
          node.typeAnnotation.typeAnnotation,
          j.tsUndefinedKeyword(),
        ]);
      }
    })
    .toSource();
};

module.exports.parser = "tsx";
