import { RequestHandler } from 'express';
import { Types } from 'mongoose';

// Create generic type and append error prop to the Type T
type WithError<T> = T & { error: string };

export type ExpressHandler<Req, Res> = RequestHandler<
    string,
    Partial<WithError<Res>>,
    Partial<Req>,
    any
>

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>

export interface JwtObject {
    userId : Types.ObjectId;
}