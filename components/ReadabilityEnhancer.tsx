interface ReadabilityEnhancerProps {
  children: React.ReactNode;
}

export default function ReadabilityEnhancer({ children }: ReadabilityEnhancerProps) {
  return <div className="readability-wrapper">{children}</div>;
}
