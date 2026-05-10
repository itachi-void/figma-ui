import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#FDF2E9] flex flex-col items-center justify-center p-4 text-center font-sans">

      {/* الجزء العلوي: النصوص */}
      <div className="mb-8">
        <h2 className="text-[#E67E22] text-2xl md:text-4xl font-bold mb-2">
          Oh Crumbs!
        </h2>
        <h1 className="text-[#C0392B] text-4xl md:text-6xl font-black mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg md:text-xl font-medium tracking-widest uppercase">
          RecycleHub • Smart Recycling • Sustainability
        </p>
      </div>

      {/* رقم 404 الكبير مع تأثير ثلاثي الأبعاد */}
      <div className="relative mb-8">
        <div className="relative inline-block">
          {/* Shadow layers for 3D effect */}
          <span className="absolute text-[#8B2635] text-[120px] md:text-[200px] font-black leading-none translate-x-2 translate-y-2">
            404
          </span>
          <span className="absolute text-[#A03247] text-[120px] md:text-[200px] font-black leading-none translate-x-1.5 translate-y-1.5">
            404
          </span>
          <span className="absolute text-[#B63E52] text-[120px] md:text-[200px] font-black leading-none translate-x-1 translate-y-1">
            404
          </span>
          {/* Main number */}
          <span className="relative text-[#C0392B] text-[120px] md:text-[200px] font-black leading-none drop-shadow-lg">
            404
          </span>
        </div>
      </div>

      {/* الرسالة السفلية */}
      <div className="mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Oh Crumbs!
        </h3>
        <p className="text-gray-600 text-lg">
          The page you're looking for escaped.
        </p>
      </div>

      {/* منطقة الأنميشن - عناصر إعادة التدوير */}
      <div className="relative w-full max-w-2xl h-64 flex items-end justify-center">

        {/* زجاجات متحركة - عالشمال */}
        <div className="absolute left-0 bottom-0 flex gap-2">
          <div className="w-4 h-16 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
          <div className="w-4 h-16 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2s' }}></div>
          <div className="w-4 h-16 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2s' }}></div>
        </div>

        {/* صندوق إعادة التدوير - في النص */}
        <div className="bg-black w-24 h-32 md:w-32 md:h-40 rounded-t-full relative overflow-hidden border-b-4 border-gray-300">
          {/* العيون اللي جوه الصندوق */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* زجاجات متحركة - عاليمين */}
        <div className="absolute right-0 bottom-0 flex gap-2">
          <div className="w-4 h-16 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
          <div className="w-4 h-16 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '2s' }}></div>
          <div className="w-4 h-16 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
        </div>

      </div>

      {/* زرار الرجوع */}
      <Link
        to="/"
        className="mt-12 px-8 py-3 bg-[#E67E22] text-white font-bold rounded-full hover:bg-[#D35400] transition-colors shadow-lg"
      >
        Go Back Home
      </Link>

    </div>
  );
};

export default NotFoundPage;