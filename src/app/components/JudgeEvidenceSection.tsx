import type { ReactNode } from "react";
import { Award, Code2, Lightbulb, Users, Presentation } from "lucide-react";
import type { JudgeEvidence } from "../../types/strategy";

const categories: Array<{
  key: keyof JudgeEvidence;
  title: string;
  icon: ReactNode;
  accent: string;
}> = [
  { key: "technicalExecution", title: "Technical Execution", icon: <Code2 size={15} />, accent: "text-[#0ECB81]" },
  { key: "originality", title: "Originality", icon: <Lightbulb size={15} />, accent: "text-[#F0B90B]" },
  { key: "realWorldRelevance", title: "Real-World Relevance", icon: <Users size={15} />, accent: "text-[#3B82F6]" },
  { key: "demoPresentation", title: "Demo & Presentation", icon: <Presentation size={15} />, accent: "text-[#A855F7]" },
];

export function JudgeEvidenceSection({ evidence }: { evidence: JudgeEvidence }) {
  return (
    <section id="judging-fit">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Track 2 Judging Fit</h2>
        <span className="text-[#848E9C] text-xs ml-1">Mapped to the four judging criteria</span>
      </div>
      <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/20 flex items-center justify-center flex-shrink-0">
            <Award size={16} className="text-[#F0B90B]" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-1">Why this matters for submission</div>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              Track 2 is judged by technical execution, originality, real-world relevance, and demo clarity. This section turns the generated strategy into judge-readable evidence.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => (
          <div key={category.key} className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={category.accent}>{category.icon}</span>
              <span className="text-white text-sm font-semibold">{category.title}</span>
            </div>
            <ul className="space-y-2">
              {evidence[category.key].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[#C8CDD6] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
