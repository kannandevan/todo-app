import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './TimePicker.css';

const TimePicker = ({ value, onChange, placeholder = "Set Time", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Internal state for the picker (12h format)
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState('AM');
    const [view, setView] = useState('hours'); // 'hours' or 'minutes'

    const modalRef = useRef(null);

    // Initialize from value prop (HH:MM 24h)
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            const isPM = h >= 12;
            setPeriod(isPM ? 'PM' : 'AM');
            setHour(h > 12 ? h - 12 : (h === 0 ? 12 : h));
            setMinute(m);
        }
    }, [value, isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Since we are using a portal, the event target structure is preserved,
            // but we need to ensure we checking against the ref which is inside the portal.
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Use mousedown on document to catch clicks outside the modal
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleHourSelect = (h) => {
        setHour(h);
        setView('minutes'); // Auto-advance
    };

    const handleMinuteSelect = (m) => {
        setMinute(m);
    };

    const handleOk = () => {
        // Convert back to 24h HH:MM
        let h = hour;
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;

        const formattedHour = h.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');

        // Simulate event object to match standard input behavior
        onChange({ target: { value: `${formattedHour}:${formattedMinute}` } });
        setIsOpen(false);
    };

    const getHandRotation = () => {
        if (view === 'hours') {
            // 30 degrees per hour. 12 is 0/360.
            return (hour % 12) * 30;
        } else {
            // 6 degrees per minute.
            return minute * 6;
        }
    };

    // Generate clock numbers
    const renderClockNumbers = () => {
        const numbers = [];
        const count = 12; // 12 positions
        const radius = 90; // distance from center
        const center = 110; // 220/2

        for (let i = 1; i <= count; i++) {
            const val = view === 'hours' ? i : (i === 12 ? 0 : i * 5);
            const displayVal = view === 'hours' ? i : val.toString().padStart(2, '0');

            // Angle in radians. 12 is -PI/2.
            // i=3 is 0. i=6 is PI/2.
            const angleDeg = i * 30;
            const angleRad = (angleDeg - 90) * (Math.PI / 180);

            const x = center + radius * Math.cos(angleRad);
            const y = center + radius * Math.sin(angleRad);

            const isSelected = view === 'hours'
                ? hour === val || (hour === 12 && val === 12 && i === 12)
                : minute === val;

            numbers.push(
                <div
                    key={i}
                    className={`clock-number ${isSelected ? 'selected' : ''}`}
                    style={{ left: x - 16, top: y - 16 }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent closing when clicking numbers
                        view === 'hours' ? handleHourSelect(val) : handleMinuteSelect(val);
                    }}
                >
                    {displayVal}
                </div>
            );
        }
        return numbers;
    };

    const formatDisplayTime = () => {
        if (!value) return '';
        const [h, m] = value.split(':');
        let displayH = parseInt(h);
        const displayPeriod = displayH >= 12 ? 'PM' : 'AM';
        if (displayH > 12) displayH -= 12;
        if (displayH === 0) displayH = 12;
        return `${displayH}:${m} ${displayPeriod}`;
    };

    return (
        <div className="time-picker-container">
            <input
                type="text"
                className={`add-input time-picker-input ${className}`}
                value={formatDisplayTime()}
                placeholder={placeholder}
                readOnly
                onClick={() => setIsOpen(true)}
            />

            {isOpen && createPortal(
                <div className="time-picker-modal-overlay">
                    <div className="time-picker-modal" ref={modalRef} onMouseDown={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className="time-picker-header">
                            <div className="time-display">
                                <span
                                    className={`time-value ${view === 'hours' ? 'active' : ''}`}
                                    onClick={() => setView('hours')}
                                >
                                    {hour.toString().padStart(2, '0')}
                                </span>
                                <span className="time-separator">:</span>
                                <span
                                    className={`time-value ${view === 'minutes' ? 'active' : ''}`}
                                    onClick={() => setView('minutes')}
                                >
                                    {minute.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <div className="am-pm-toggle">
                                <span
                                    className={`am-pm-btn ${period === 'AM' ? 'active' : ''}`}
                                    onClick={() => setPeriod('AM')}
                                >
                                    AM
                                </span>
                                <span
                                    className={`am-pm-btn ${period === 'PM' ? 'active' : ''}`}
                                    onClick={() => setPeriod('PM')}
                                >
                                    PM
                                </span>
                            </div>
                        </div>

                        {/* Clock Face */}
                        <div className="clock-face-container">
                            <div className="clock-face">
                                <div className="clock-center"></div>
                                <div
                                    className="clock-hand"
                                    style={{ transform: `translateX(-50%) rotate(${getHandRotation()}deg)` }}
                                ></div>
                                {renderClockNumbers()}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="time-picker-footer">
                            <button className="time-picker-btn cancel" onClick={() => {
                                onChange({ target: { value: '' } });
                                setIsOpen(false);
                            }}>
                                Clear
                            </button>
                            <button className="time-picker-btn cancel" onClick={() => setIsOpen(false)}>
                                Cancel
                            </button>
                            <button className="time-picker-btn" onClick={handleOk}>
                                OK
                            </button>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default TimePicker;
