'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

// Define types
interface FormData {
    fullName: string;
}

interface FormErrors {
    fullName?: string;
}

export const UserForm = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Clear submit error
        if (submitError) {
            setSubmitError(null);
        }
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'A Name is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Insert data into Supabase
            const { data, error } = await supabase
                .from('User_name_table')
                .insert([
                    {
                        user_full_name: formData.fullName,
                    }
                ])
                .select();

            if (error) {
                throw error;
            }

            // Log the JSON output (optional)
            console.log('Form submitted successfully:', data);
            console.log('Form Data as JSON:', JSON.stringify(formData, null, 2));

            // Show success message
            setIsSubmitted(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({
                    fullName: '',
                });
                setIsSubmitted(false);
            }, 3000);

        } catch (error: any) {
            console.error('Error submitting form:', error);
            setSubmitError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className='py-12 px-4'>
            <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>Take out some time</h1>
                    <p className='text-gray-600 text-xl'>Drop in your full name please ♥</p>
                </div>

                {/* Form Card */}
                <div className='bg-white border-2 border-purple-200 rounded-2xl shadow-xl p-8'>
                    {isSubmitted ? (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                </svg>
                            </div>
                            <h3 className='text-2xl font-semibold text-gray-900 mb-2'>Thank you!</h3>
                            <p className='text-gray-600'>You have an amazing name ⭐.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Error Alert */}
                            {submitError && (
                                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                                    <p className='text-sm'>{submitError}</p>
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Full Name *
                                </label>
                                <input
                                    type='text'
                                    id='fullName'
                                    name='fullName'
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    placeholder='your name'
                                />
                                {errors.fullName && <p className='text-red-500 text-sm mt-1'>{errors.fullName}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-purple-300 disabled:cursor-not-allowed disabled:transform-none'
                            >
                                {isSubmitting ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}