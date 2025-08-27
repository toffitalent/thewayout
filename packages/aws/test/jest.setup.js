const snapshotDiff = require('snapshot-diff');

expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer());

expect.addSnapshotSerializer({
  test: (template) =>
    typeof template === 'string' || (typeof template === 'object' && template.Resources),
  print: (rawTemplate) => {
    const template =
      typeof rawTemplate === 'object' ? JSON.stringify(rawTemplate, null, 2) : rawTemplate;

    const sanitizedTemplate = template
      .replace(/"\/aws-cdk\/assets:.+"/g, '"/aws-cdk/assets:[HASH]"')
      .replace(/"RefreshToken": "[a-z0-9]+"/g, '"RefreshToken": "[HASH]"');

    return `"${sanitizedTemplate}"`;
  },
});
