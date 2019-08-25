module.exports = {
  name: 'ng-cmd',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ng-cmd',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
