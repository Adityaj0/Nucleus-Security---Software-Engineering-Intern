import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Divide, X, Minus, Plus, Equal, RotateCcw, Percent, Cpu } from 'lucide-react';

const App = () => {
    const [current, setCurrent] = useState('0');
    const [prev, setPrev] = useState('');
    const [operator, setOperator] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const appendNumber = (num) => {
        if (current === '0' && num !== '.') {
            setCurrent(num);
        } else if (num === '.' && current.includes('.')) {
            return;
        } else {
            setCurrent(prevCurrent => prevCurrent + num);
        }
    };

    const clear = () => {
        setCurrent('0');
        setPrev('');
        setOperator(null);
        setError(null);
    };

    const deleteLast = () => {
        if (current.length === 1) {
            setCurrent('0');
        } else {
            setCurrent(current.slice(0, -1));
        }
    };

    const handleOperator = (op) => {
        if (operator !== null) {
            calculate();
        }
        setOperator(op);
        setPrev(current);
        setCurrent('0');
    };

    const calculate = async () => {
        if (!operator || !prev) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operation: mapOperator(operator),
                    a: prev,
                    b: current
                })
            });

            const data = await response.json();
            if (response.ok) {
                setCurrent(data.result.toString());
                setPrev('');
                setOperator(null);
            } else {
                setError(data.error);
                setCurrent('ERROR');
            }
        } catch (err) {
            setError('Connection failed');
            setCurrent('ERROR');
        } finally {
            setLoading(false);
        }
    };

    const mapOperator = (op) => {
        switch (op) {
            case '+': return 'add';
            case '-': return 'subtract';
            case '×': return 'multiply';
            case '÷': return 'divide';
            case '^': return 'pow';
            default: return op;
        }
    };

    const handleSpecial = async (op) => {
        if (op === '√') {
            setLoading(true);
            try {
                const response = await fetch('/api/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        operation: 'sqrt',
                        a: current
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    setCurrent(data.result.toString());
                } else {
                    setError(data.error);
                    setCurrent('ERROR');
                }
            } catch (err) {
                setError('Error');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <div className="glitch-bg"></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="calculator-container"
            >
                <div className="header">
                    <h1>Quantum.Calc</h1>
                </div>

                <div className="status-bar">
                    <div className="status-left">
                        <Cpu size={12} style={{ marginRight: 4, display: 'inline' }} />
                        SYSTEM_ACTIVE
                    </div>
                    <div className="status-right">
                        {loading ? 'CALCULATING...' : (error ? error.toUpperCase() : 'READY')}
                    </div>
                </div>

                <div className="display">
                    <div className="display-prev">
                        {prev} {operator}
                    </div>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="display-current"
                    >
                        {current}
                    </motion.div>
                </div>

                <div className="keypad">
                    <button className="btn-clear" onClick={clear}>AC</button>
                    <button onClick={() => handleOperator('^')}>^</button>
                    <button onClick={() => handleSpecial('√')}>√</button>
                    <button className="btn-operator" onClick={() => handleOperator('÷')}>
                        <Divide size={20} />
                    </button>

                    <button onClick={() => appendNumber('7')}>7</button>
                    <button onClick={() => appendNumber('8')}>8</button>
                    <button onClick={() => appendNumber('9')}>9</button>
                    <button className="btn-operator" onClick={() => handleOperator('×')}>
                        <X size={20} />
                    </button>

                    <button onClick={() => appendNumber('4')}>4</button>
                    <button onClick={() => appendNumber('5')}>5</button>
                    <button onClick={() => appendNumber('6')}>6</button>
                    <button className="btn-operator" onClick={() => handleOperator('-')}>
                        <Minus size={20} />
                    </button>

                    <button onClick={() => appendNumber('1')}>1</button>
                    <button onClick={() => appendNumber('2')}>2</button>
                    <button onClick={() => appendNumber('3')}>3</button>
                    <button className="btn-operator" onClick={() => handleOperator('+')}>
                        <Plus size={20} />
                    </button>

                    <button onClick={() => appendNumber('0')}>0</button>
                    <button onClick={() => appendNumber('.')}>.</button>
                    <button onClick={deleteLast}>
                        <Delete size={20} />
                    </button>
                    <button className="btn-equal" onClick={calculate}>
                        <Equal size={20} />
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default App;
