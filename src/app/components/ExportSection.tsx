import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { StrategyResponse } from "../../types/strategy";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

function CodePanel({ content, language }: { content: string; language: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative">
      <button
        onClick={() => copy(content)}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#2B3139] text-[#848E9C] hover:bg-[#3B4149] hover:text-white transition-colors z-10"
      >
        {copied ? <Check size={12} className="text-[#0ECB81]" /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="bg-[#0B0E11] border border-[#2B3139] rounded-xl p-4 overflow-x-auto text-xs text-[#C8CDD6] leading-relaxed min-h-48 max-h-80">
        <code className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  );
}

export function JsonStrategySpec({ data }: { data: StrategyResponse }) {
  const content = JSON.stringify(data.jsonOutput, null, 2);
  return <CodePanel content={content} language="json" />;
}

export function MarkdownReport({ data }: { data: StrategyResponse }) {
  return <CodePanel content={data.markdownReport} language="markdown" />;
}

export function CmcSkillOutput({ data }: { data: StrategyResponse }) {
  const content = JSON.stringify(data.cmcSkillOutput, null, 2);
  return <CodePanel content={content} language="json" />;
}

export function LlmSkillOutput({ data }: { data: StrategyResponse }) {
  const content = JSON.stringify(data.llmSkillOutput, null, 2);
  return <CodePanel content={content} language="json" />;
}

const TABS = [
  { id: "json", label: "JSON Strategy Spec" },
  { id: "markdown", label: "Markdown Report" },
  { id: "cmc", label: "CMC Skill Output" },
  { id: "llm", label: "LLM Skill Output" },
];

export function ExportSection({ data }: { data: StrategyResponse }) {
  const [activeTab, setActiveTab] = useState("json");

  return (
    <section id="export">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Export Strategy</h2>
      </div>
      <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden">
        <div className="flex border-b border-[#2B3139]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[#F0B90B] border-b-2 border-[#F0B90B] bg-[#F0B90B]/5"
                  : "text-[#848E9C] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === "json" && <JsonStrategySpec data={data} />}
          {activeTab === "markdown" && <MarkdownReport data={data} />}
          {activeTab === "cmc" && <CmcSkillOutput data={data} />}
          {activeTab === "llm" && <LlmSkillOutput data={data} />}
        </div>
      </div>
    </section>
  );
}
