export {};
declare module 'vue' {
  // @ts-ignore
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}

// 声明uni挂载的自定义函数
declare namespace UniNamespace {
  interface Uni {
    $zx: {
      /**
       * 跳转到指定页面
       */
      route(options?: string | object, params?: object): Promise<void>;
      message: {
        confirm(
          content?: string,
          title?: string,
          options?: object
        ): Promise<void>;
        alert(content?: string, title?: string, options?: object): Promis<any>;
        toast(message: string);
      };
      moment(options?: any): any;
      isHasPermission(permission: Array<string>): boolean;
      isHasRole(permission: Array<string>): boolean;
    };
  }
}
