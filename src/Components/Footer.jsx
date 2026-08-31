import { SocialIcon } from "react-social-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FooterColumn } from "./FooterColumn";

function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-white mt-24">
      <div className="mx-auto px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-xs tracking-[3px] uppercase font-semibold mb-6">
                Subscribe To Our Emails
              </h3>

              <div className="flex bg-white rounded-full overflow-hidden max-w-md">
                <Input
                  placeholder="Email Address"
                  className="border-0 shadow-none text-black focus-visible:ring-0 rounded-none"
                />

                <Button className="rounded-none rounded-r-full px-8 bg-white text-black hover:bg-gray-100">
                  SIGN UP
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-[3px] uppercase font-semibold mb-5">
                Follow The Flock
              </h3>

              <div className="flex gap-4">
                <SocialIcon url="https://x.com" />
              </div>
            </div>
          </div>

          <FooterColumn
            title="Help"
            items={["help@nova.com", "FAQ / Contact Us", "Returns / Exchanges"]}
          />

          <FooterColumn
            title="Shop"
            items={["Men", "Women", "Sale", "New Arrivals"]}
          />

          <FooterColumn
            title="Company"
            items={[
              "Our Story",
              "Our Materials",
              "Sustainability",
              "Press",
              "Careers",
              "Community",
            ]}
          />
        </div>

        <div className="border-t border-white/20 mt-16 pt-8">
          <div className="flex flex-wrap justify-between gap-8 text-sm text-gray-300">
            <p>© 2026 NOVA. All Rights Reserved.</p>

            <div className="flex flex-wrap gap-8">
              <a href="#">Refund Policy</a>

              <a href="#">Privacy Policy</a>

              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
