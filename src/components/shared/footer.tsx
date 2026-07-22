import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { PiTiktokLogo } from "react-icons/pi";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-7 py-14">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-primary">LoopTani</h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Marketplace digital yang menghubungkan petani, pelaku usaha, dan
                pembeli limbah pertanian serta produk olahan secara
                berkelanjutan.
              </p>
            </div>

            <div className="flex gap-3">
              {[
                {
                  href: "#",
                  icon: <PiTiktokLogo size={20} />,
                },
                {
                  href: "#",
                  icon: <FaInstagram size={18} />,
                },
                {
                  href: "#",
                  icon: <FaFacebookF size={17} />,
                },
                {
                  href: "#",
                  icon: <FaLinkedinIn size={17} />,
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-foreground">
              Marketplace
            </h3>

            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link
                  href="/marketplace"
                  className="animation-link-background w-fit"
                >
                  Semua Produk
                </Link>
              </li>

              <li>
                <Link
                  href="/marketplace?category=agricultural-waste"
                  className="animation-link-background w-fit"
                >
                  Limbah Pertanian
                </Link>
              </li>

              <li>
                <Link
                  href="/marketplace?category=processed-product"
                  className="animation-link-background w-fit"
                >
                  Produk Olahan
                </Link>
              </li>

              <li>
                <Link
                  href="/marketplace?category=secondhand"
                  className="animation-link-background w-fit"
                >
                  Alat Secondhand
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-foreground">
              Bantuan
            </h3>

            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="/about" className="animation-link-background w-fit">
                  Tentang Kami
                </Link>
              </li>

              <li>
                <Link href="#" className="animation-link-background w-fit">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="#" className="animation-link-background w-fit">
                  Kebijakan Privasi
                </Link>
              </li>

              <li>
                <Link href="#" className="animation-link-background w-fit">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-foreground">
              Hubungi Kami
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />

                <div>
                  <p className="font-medium text-foreground">Telepon</p>
                  <p className="text-muted-foreground">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />

                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-muted-foreground">hello@looptani.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />

                <div>
                  <p className="font-medium text-foreground">Alamat</p>
                  <p className="text-muted-foreground">
                    Pekanbaru, Riau, Indonesia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} <strong>LoopTani</strong>. All rights
            reserved.
          </p>

          <div className="flex gap-6">
            <Link href="#" className="animation-link-background">
              Kebijakan Privasi
            </Link>

            <Link href="#" className="animation-link-background">
              Syarat Penggunaan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
