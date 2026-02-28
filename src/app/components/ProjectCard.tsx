import { motion } from "motion/react";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  impact?: string;
}

export function ProjectCard({ title, description, tech, impact }: ProjectCardProps) {
  return (
    <motion.div
      className="relative p-8 rounded-lg border border-gray-700 bg-[#111827] hover:border-teal-500 transition-all duration-300"
      whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(20, 184, 166, 0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl mb-4" style={{ color: '#f3f4f6' }}>{title}</h3>
      <p className="mb-4 leading-relaxed" style={{ color: '#9ca3af', lineHeight: '1.7' }}>
        {description}
      </p>
      
      {impact && (
        <p className="mb-4 text-sm" style={{ color: '#14b8a6' }}>
          {impact}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {tech.map((item, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-sm font-mono border border-gray-700 rounded"
            style={{ color: '#9ca3af', backgroundColor: '#0a0e27' }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
