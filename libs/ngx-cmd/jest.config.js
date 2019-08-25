module.exports = {
  name: 'ngx-cmd',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngx-cmd',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
