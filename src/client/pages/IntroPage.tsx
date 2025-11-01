import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';

const IntroPage: React.FC = () => {
    const navigate = useNavigate();

    const handlePlay = () => {
        navigate('/grid');
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #312e81 100%)',
                backgroundColor: '#1e1b4b'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="text-center z-10 max-w-4xl mx-auto">
                {/* Logo/Icon */}
                <motion.div
                    className="text-8xl mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.3
                    }}
                >
                    🧩
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
                >
                    Mystery Versal
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-xl md:text-2xl text-gray-100 mb-6 max-w-3xl mx-auto leading-relaxed font-medium"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
                >
                    Embark on an epic puzzle hunt across Reddit communities.
                    Solve mysteries, unlock secrets, and piece together the ultimate revelation.
                </motion.p>

                {/* Features */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <div className="rounded-2xl p-4 border border-white border-opacity-30" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="text-4xl mb-2">🔍</div>
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">Explore</h3>
                    </div>

                    <div className="rounded-2xl p-4 border border-white border-opacity-30" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="text-4xl mb-2">🧠</div>
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">Solve Puzzles</h3>
                    </div>

                    <div className="rounded-2xl p-4 border border-white border-opacity-30" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="text-4xl mb-2">🏆</div>
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">Unlock Mysteries</h3>
                    </div>
                </motion.div>

                {/* Play button */}
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                        delay: 1.5,
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                >
                    <Button
                        variant="primary"
                        size="large"
                        onClick={handlePlay}
                        className="text-xl px-12 py-4 rounded-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
                        style={{ 
                            backgroundColor: '#ffffff',
                            color: '#581c87'
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="font-extrabold">Start Your Journey</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </Button>
                </motion.div>

                {/* Instructions */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                >
                    <p className="text-gray-200 text-base font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                        Ready to test your wits? Click above to begin the mystery!
                    </p>
                </motion.div>
            </div>

            {/* Floating puzzle pieces */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-4xl opacity-10"
                        style={{
                            left: `${10 + (i * 12)}%`,
                            top: `${20 + (i % 3) * 30}%`
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 10, -10, 0],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut"
                        }}
                    >
                        🧩
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default IntroPage;