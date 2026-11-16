// آدرس و شمارهٔ عمومی فروشگاه را اینجا وارد کنید. شمارهٔ ثابت را همراه پیش‌شماره بنویسید.
export const storeContact = {
  address: "خیابان انقلاب، پل چوبی، سپاه شمالی، پلاک ۶۵",
  phones: ["", ""],
};

export function dialLink(phone: string) {
  const ascii = phone.replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632));
  return "tel:" + ascii.replace(/[^+\d]/g, "");
}
