import {
  addMethodMetadata,
  addMethodParamsMetadata,
  LEAP_ROUTER_MIDDLEWARE,
  IConstructor,
  DESIGN_PARAM_TYPES,
} from '@leapjs/common';

function addMethodMiddleware(
  target: IConstructor<any>,
  methodName: string,
  type: string,
  middleware: Function,
): void {
  const existingMetadata: any = [];
  const klass = methodName ? target.prototype[methodName] : target.prototype;
  const middlewares = Reflect.getMetadata(LEAP_ROUTER_MIDDLEWARE, klass);
  if (middlewares) {
    existingMetadata.push(...middlewares);
  }
  existingMetadata.push({
    source: middleware,
    type,
    target: klass,
  });
  Reflect.defineMetadata(LEAP_ROUTER_MIDDLEWARE, existingMetadata, klass);
}

function addRoute(
  method: string,
  target: IConstructor<any>,
  methodName: string,
  route: string,
  params: [string, string][],
): void {
  for (let i = 0; i < params.length; i += 1) {
    Reflect.defineMetadata(
      DESIGN_PARAM_TYPES,
      {
        type: params[i][0],
        target: target.prototype,
        methodName,
        index: i,
        name: params[i][1],
        options: undefined,
      },
      target,
      methodName,
    );
    addMethodParamsMetadata(
      params[i][0],
      target.prototype,
      methodName,
      i,
      params[i][1],
    );
  }
  addMethodMetadata(
    method,
    target.prototype,
    methodName,
    {
      value: target.prototype.createOne,
      writable: true,
      enumerable: false,
      configurable: true,
    } as PropertyDescriptor,
    route || '/',
  );
}

export { addRoute, addMethodMiddleware };