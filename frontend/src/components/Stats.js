import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Items Found', value: '240+' },
  { label: 'Items Returned', value: '180+' },
  { label: 'Hours Average', value: '24' },
  { label: 'Satisfaction Rate', value: '75%' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Stats() {
  return (
    <section className="py-16 bg-[#a8f0f7]/60 dark:bg-[#0f172a]/60 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl shadow hover:shadow-xl transition border border-white/30 bg-white/50 backdrop-blur-md"
              variants={cardVariants}
            >
              <h3 className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</h3>
              <p className="text-gray-800">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;
