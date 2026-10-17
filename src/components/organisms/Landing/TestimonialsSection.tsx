
import BackgroundImage from "@/app/assets/Image/Comment.jpg";
import { CommentCard } from "@/components/molecules";

const comments = [
  {
    id: 1,
    content:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
    authorName: "امیر محمد",
    date: "۱۲ مرداد ۱۴۰۱",
  },
  {
    id: 2,
    content:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
    authorName: "امیر محمد",
    date: "۱۲ مرداد ۱۴۰۱",
  },
  {
    id: 3,
    content:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
    authorName: "امیر محمد",
    date: "۱۲ مرداد ۱۴۰۱",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className="
        relative  isolate w-full overflow-hidden
        bg-cover bg-center bg-no-repeat bg-fixed
      "
      style={{
        backgroundImage: `url("${BackgroundImage.src}")`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black/40"
      />

<div
  className="
    mx-auto grid w-full
    grid-cols-1 gap-8 px-5 md:pb-24
    md:grid-cols-2 md:items-center
    md:gap-12 md:px-10 md:py-16
    lg:gap-20 lg:px-[100px]
  "
>
  {/* Section content */}
  <div className="flex min-w-0 flex-col justify-center text-white">
    <h2 className="text-2xl font-bold leading-relaxed md:text-3xl">
      رضایت شما اعتبار ماست
    </h2>

    <p className="mt-5 text-sm leading-8 text-white/90 md:text-base">
      پیدا کردن ویلای مناسب همیشه کار راحتی نیست. ما اینجاییم تا همه
      چیز رو برای شما ساده کنیم. از بین صدها فایل، فقط بهترین و
      معتبرترین گزینه‌ها رو گلچین می‌کنیم تا وقت ارزشمندتون صرف
      جست‌وجوی بی‌پایان نشه. به تجربه‌ی اجاره‌ی راحت و بدون دغدغه
      خوش اومدید.
    </p>
  </div>

  {/* Comment cards */}
  <div className="flex min-w-0 flex-col items-center gap-4 md:items-start">
    {comments.map((comment) => (
      <div key={comment.id} className="w-full max-w-sm">
        <CommentCard
          content={comment.content}
          authorName={comment.authorName}
          date={comment.date}
        />
      </div>
    ))}
  </div>
</div>
    </section>
  );
}
