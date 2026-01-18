
import React from 'react';
import AdPlaceholder from '../components/AdPlaceholder';

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20 space-y-16 animate-fade-up">
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">DISCLAIMER & <span className="text-red-600">FAQ</span></h1>
        <p className="text-slate-500 font-medium">Clear information about our analytics engine.</p>
      </div>

      <div className="space-y-12">
        <section className="bg-[#121216] p-10 rounded-[2.5rem] border border-white/5">
          <h2 className="text-2xl font-black mb-6">General Disclaimer</h2>
          <p className="text-slate-400 leading-relaxed font-medium">
            YouTube Monetization Check Status is an independent analytical tool. We are not affiliated with, endorsed by, or in any way officially connected with YouTube, Google LLC, or any of its subsidiaries or its affiliates. The estimates provided by this tool are based on publicly available data and complex algorithms designed to mimic YouTube's monetization criteria. They are intended for educational and research purposes only.
          </p>
        </section>

        <AdPlaceholder type="smart-link" label="Professional SEO Tools" className="w-full justify-center" />

        <section className="space-y-8">
          <h2 className="text-3xl font-black italic opacity-20">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <FAQItem question="How accurate are the revenue estimates?" answer="Our estimates use industry-standard CPM averages across different niches. While highly precise for established channels, they can vary based on geographic location and advertiser demand." />
            <FAQItem question="Why does a channel show as 'Not Monetized'?" answer="This could be due to several factors: the channel hasn't reached the 1k sub/4k watch hour threshold, it contains copyrighted material, or it hasn't applied for the YouTube Partner Program." />
            <FAQItem question="Is this tool free to use?" answer="Yes, our basic monetization check is 100% free. We are supported by our partner network and advertising." />
          </div>
        </section>
      </div>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="bg-[#121216]/50 border border-white/5 p-8 rounded-3xl">
    <h4 className="font-black text-lg mb-3 text-white">{question}</h4>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{answer}</p>
  </div>
);

export default Disclaimer;
