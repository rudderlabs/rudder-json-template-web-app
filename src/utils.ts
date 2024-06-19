import { CodeType } from './types';

export class CommonUtils {
  static readonly DEFAULT_TIMEOUT = 15000;
  static wait(timeInMilliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeInMilliseconds);
    });
  }

  static timeout(timeInMilliseconds: number): Promise<void> {
    return this.wait(timeInMilliseconds).then(() => {
      throw new Error('Timed out');
    });
  }

  static resolveWithTimeout(promise: Promise<any>, timeInMilliseconds: number): Promise<any> {
    return Promise.race([promise, this.timeout(timeInMilliseconds)]);
  }

  static getNavigationPath(type: CodeType) {
    switch (type) {
      case CodeType.JsonTemplate:
        return '/json-template';
      case CodeType.Mappings:
        return '/mappings';
      default:
        return '/workflow-engine';
    }
  }
}
