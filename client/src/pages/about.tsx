import { SectionHeader } from "@/components/ui/section-header";
import { IMAGES } from "@/lib/constants";

export default function About() {
  return (
    <div className="container mx-auto py-12 px-4">
      <SectionHeader
        title="Haqqımızda"
        subtitle="20 illik təcrübə ilə dekorativ məhsullar istehsal edirik"
      />

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <img
            src={IMAGES.about}
            alt="Şirkət"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">Bizim Hekayəmiz</h3>
          <p className="text-muted-foreground mb-4">
            2003-cü ildən etibarən Azərbaycanda dekorativ məhsullar istehsal edirik. 
            Müasir texnologiya və ənənəvi sənətkarlığı birləşdirərək yüksək 
            keyfiyyətli məhsullar yaradırıq.
          </p>
          <p className="text-muted-foreground">
            Məqsədimiz müştərilərimizə ən yaxşı keyfiyyəti təqdim etməkdir. 
            Bütün məhsullarımız peşəkar ustalar tərəfindən hazırlanır və 
            keyfiyyət yoxlamasından keçir.
          </p>
        </div>
      </div>

      <SectionHeader title="İstehsal Prosesi" />
      <div className="grid md:grid-cols-3 gap-6">
        {IMAGES.manufacturing.map((image, i) => (
          <img
            key={i}
            src={image}
            alt={`İstehsal prosesi ${i + 1}`}
            className="rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
