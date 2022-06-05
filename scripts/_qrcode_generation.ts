// apiRoutes.post("/generate/qrcode", async (req: Request, res: Response) => {
//   const FRONTEND_APP_URL =
//     process.env.FRONTEND_APP_URL || "http://localhost:3000";

//   const generateQR = async (text: string) => {
//     try {
//       return await QRCode.toDataURL(text);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const src = await generateQR(
//     `${FRONTEND_APP_URL}/generate?type=qrcode&table_number=A20`
//   );

//   return res.status(200).json({ src });
// });
