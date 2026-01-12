import PublicLayout from "@/Layouts/PublicLayout";
import InnerBanner from "@/Components/InnerBanner";
import useTranslate from "@/hooks/useTranslate";

export default function InnerPageLayout({
  titleKey,
  children,
  isHome = false, // ✅ home flag
}) {
  const { t } = useTranslate();

  return (
    <PublicLayout>
      <InnerBanner
        title={t(titleKey)}
        image={isHome ? "/images/banner1.png" : "/images/banner.png"}
        objectPosition="center"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font">
        {children}
      </div>
    </PublicLayout>
  );
}
