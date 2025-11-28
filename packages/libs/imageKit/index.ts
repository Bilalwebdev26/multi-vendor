import ImageKit from "imagekit"

export const imageKit  = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // This is the default and can be omitted
  publicKey:process.env.IMAGEKIT_PUBLIC_KEY as string,
  urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT as string
});