import React from "react";
import Link from "next/link";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyCart({
  title = "Your cart is empty",
  subtitle = "Looks like you haven’t added anything to your cart yet.",
  primaryCta = { label: "Continue shopping", href: "/" },
  secondaryCta = { label: "View wishlist", href: "/wishlist" },
  showIllustration = true,
}) {
  return (
    <div className="w-full flex items-center justify-center py-24 px-4">
      <div className="max-w-xl w-full text-center">
        <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-white shadow-lg flex items-center justify-center"
            aria-hidden
          >
            <div className="p-6 rounded-full bg-white/70 backdrop-blur-sm">
              <ShoppingCart className="w-14 h-14 text-gray-600" />
            </div>
          </motion.div>

          {/* Decorative corner heart */}
          <motion.div
            initial={{ x: 10, y: -10, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -right-3 -top-3 bg-white rounded-full p-2 shadow-md"
            aria-hidden
          >
            <Heart className="w-5 h-5 text-pink-500" />
          </motion.div>
        </div>

        <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-800">{title}</h2>

        <p className="mt-2 text-gray-500 max-w-[38rem] mx-auto">{subtitle}</p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Primary CTA: will use Link if href present */}
          {primaryCta?.href ? (
            <Link href={primaryCta.href} className="inline-flex">
              <a className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg shadow hover:shadow-lg transition">
                <span>{primaryCta.label}</span>
                <ArrowRight className="w-4 h-4 text-white/90" />
              </a>
            </Link>
          ) : (
            <button className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg shadow hover:shadow-lg transition">
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 text-white/90" />
            </button>
          )}

          {/* Secondary CTA */}
          {secondaryCta?.href ? (
            <Link href={secondaryCta.href} className="inline-flex">
              <a className="inline-flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                {secondaryCta.label}
              </a>
            </Link>
          ) : (
            <button className="inline-flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              {secondaryCta.label}
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <p>
            Tip: Add items to your wishlist and move them to the cart later. We’ll keep
            them safe for you.
          </p>
        </div>

        {/* Optional small illustration / promo area */}
        {showIllustration && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700">Hot picks for you</h4>
              <p className="mt-1 text-xs text-gray-500">Handpicked products based on what you viewed recently.</p>
            </div>

            <div className="p-4 flex items-center justify-center bg-white rounded-lg shadow-sm">
              <img
                src="/empty-cart-illustration.svg"
                alt="Empty cart illustration"
                className="max-h-20"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
