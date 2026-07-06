import Link from "next/link";
import {
  PaymentGateway,
  PaymentMethodList,
  ShippingMethod,
} from "./payment-gateway-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionItem2,
  AccordionTrigger,
  AccordionTrigger2,
} from "@/components/ui/accordion";

export const FooterLink = () => {
  return (
    <>
      <div className="w-full h-fit grid grid-cols-3 gap-5 ">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm lg:text-lg font-semibold text-background">
            Layanan Pelanggan
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="" className="animation-link-background">
                Bantuan
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Metode Pembayaran
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Lacak Pemesanan
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Hubungi Kami
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm lg:text-lg font-semibold text-background">
            Jelajah Idshopcase
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="" className="animation-link-background">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kebijakan
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Koleksi
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm lg:text-lg font-semibold text-background">
            Koleksi Kami
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="" className="animation-link-background">
                Kategori Custom Case
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kategori Keychain
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kategori Phone Charm
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kategori Pop Socket
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 w-full flex items-end">
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm lg:text-lg font-semibold text-background">
              Metode Pembayaran
            </h3>
            <div>
              <PaymentMethodList></PaymentMethodList>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm lg:text-lg font-semibold text-background">
                Metode Pengiriman
              </h3>
              <div>
                <ShippingMethod></ShippingMethod>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-sm lg:text-lg font-semibold text-background">
                Metode Pembayaran
              </h3>
              <div>
                <PaymentGateway></PaymentGateway>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export function FooterAccordionMobile() {
  return (
    <Accordion type="single" collapsible className="w-full md:hidden">
      {/* Layanan Pelanggan */}
      <AccordionItem2 value="customer">
        <AccordionTrigger2 className="text-background text-sm font-semibold">
          Layanan Pelanggan
        </AccordionTrigger2>
        <AccordionContent>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="" className="animation-link-background">
                Bantuan
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Metode Pembayaran
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Lacak Pemesanan
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Hubungi Kami
              </Link>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem2>

      {/* Jelajah */}
      <AccordionItem2 value="explore">
        <AccordionTrigger2 className="text-background text-sm font-semibold">
          Jelajah Idshopcase
        </AccordionTrigger2>
        <AccordionContent>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="" className="animation-link-background">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kebijakan
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Koleksi
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                FAQ
              </Link>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem2>

      {/* Koleksi */}
      <AccordionItem2 value="collection">
        <AccordionTrigger2 className="text-background text-sm font-semibold">
          Koleksi Kami
        </AccordionTrigger2>
        <AccordionContent>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="" className="animation-link-background">
                Kategori Custom Case
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kategori Keychain
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kategori Phone Charm
              </Link>
            </li>
            <li>
              <Link href="" className="animation-link-background">
                Kategori Pop Socket
              </Link>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem2>
      {/* Pembayaran */}
    </Accordion>
  );
}
