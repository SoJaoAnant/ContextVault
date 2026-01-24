'use client'

import React from 'react';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export const SwitchPaglu = () => {
    const [enabled, setEnabled] = useState<boolean[]>(
        Array(5).fill(false)
    )

    const toggleSwitch = (index: number, value: boolean) => {
        setEnabled(prev => {
            const copy = [...prev]
            copy[index] = value
            return copy
        })
    }

    return (
        <section className="my-5">
            <div className="flex justify-center items-center gap-2 my-2">
                {enabled.map((isOn, index) => (
                    <div
                        key={index}
                        className={`flex w-10 h-10 justify-center items-center rounded
              ${isOn ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        <Switch
                            checked={isOn}
                            onCheckedChange={(value) =>
                                toggleSwitch(index, value)
                            }
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

// Styles
const heroStyles: React.CSSProperties = {
    width: '100%',
    padding: '4rem 2rem',
    textAlign: 'center',
};

const heroContainerStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '5rem',
    marginBottom: '5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
};

const titleStyles: React.CSSProperties = {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#000000',
    lineHeight: '1.2',
    marginBottom: '1rem',
};

const subtitleStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#666666',
    fontWeight: '400',
    marginBottom: '1rem',
};

const ctaButtonStyles: React.CSSProperties = {
    padding: '1rem 2.5rem',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.2s',
};

