'use client';

export const FormattedContent = ({ text }: { text: string }) => {
    return (
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            {text.split('\n').map((line, index) => {
                if (line.trim() === '') {
                    return <div key={index} className="h-2" />; // Represents a line gap
                }
                if (line.includes('**How to use:**')) {
                     return (
                        <p key={index} className="flex flex-col">
                           <span className='h-2'></span>
                           <strong className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</strong>
                        </p>
                    )
                }
                const parts = line.split(/(\*\*.*?\*\*)|(\*.*?\*)/g).filter(Boolean);
                return (
                    <p key={index}>
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                                return <em key={partIndex} className="text-foreground/80">{part.slice(1, -1)}</em>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};
