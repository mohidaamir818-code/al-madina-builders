import { ArrowRight, Home, Phone } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.23-1.63a11.9 11.9 0 0 0 5.82 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.42ZM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.7.97.99-3.6-.23-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.11 1.03 6.97 2.9a9.82 9.82 0 0 1 2.89 6.97c0 5.44-4.43 9.83-9.9 9.83Zm5.42-7.38c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

const consultHref = `https://wa.me/923056767965?text=${encodeURIComponent(
  "Assalam o Alaikum, mujhe construction ke bare mein consultation chahiye",
)}`;

export function BuildHelpCard() {
  return (
    <aside className="h-fit self-start rounded-2xl bg-[#0B3B1E] p-5 text-white shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white">
          <Home className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="text-[22px] leading-[1.15] font-bold">Want to Build Your Own House?</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/80">
        From map to move-in, we can help you build your dream home. Get expert guidance, quality construction and
        complete support from start to finish.
      </p>
      <a
        href={consultHref}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F5B301] py-2.5 text-sm font-bold text-[#0B3B1E] transition-all duration-200 hover:bg-[#e0a200]"
      >
        Request a Free Consultation
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href="tel:03056767965"
          className="inline-flex flex-col items-center justify-center rounded-full border border-white/80 px-2 py-2 text-center text-[11px] leading-tight text-white"
        >
          <span className="inline-flex items-center gap-1 font-semibold">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call Now
          </span>
          <span>0305-6767965</span>
        </a>
        <a
          href={consultHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/80 px-2 py-2 text-center text-[11px] font-semibold text-white"
        >
          <WhatsAppIcon />
          WhatsApp
          <span className="block">Chat Now</span>
        </a>
      </div>
    </aside>
  );
}
