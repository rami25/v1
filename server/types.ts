// import { RequestHandler } from "express";

// export interface User {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   userName: string;
//   email: string;
//   password: string;
// }

// export interface Post {
//   id: string;
//   title: string;
//   url: string;
//   userId: string;
//   postedAt: number;
//   liked?: boolean;
// }

// export interface Like {
//   userId: string;
//   postId: string;
// }

// export interface Comment {
//   id: string;
//   userId: string;
//   postId: string;
//   comment: string;
//   postedAt: number;
//   liked?: boolean;
// }

// export type ExpressHandler<Req, Res> = RequestHandler<
//     string,
//     Partial<Res>,
//     Partial<Req>,
//     any
// >