import React from 'react';


export const Row = ({
        eventType = 'Event type',
        details = 'Details',
        code = '',
        date = 'Date',
        header = false
    }) => {
    if (header) {
        code = 'Code';
    }

    return (
        <div className={header ? 'table-row header' : 'table-row'}>
            <div className={'table-cell text-part'}>
                <p className={'table-cell type'}>
                    {!!eventType &&
                        <span className={`event-label ${eventType}`}>
                            {eventType}
                        </span>
                    }
                </p>
                <p className={'table-cell details'}>
                    {
                        details && details.length > 200
                            ? details.slice(0,200) + '...'
                            : details
                    }
                </p>
            </div>

            <p className={'table-cell code'}>{code}</p>
            <p className={'table-cell date'}>
                {header
                    ? 'Date'
                    : date.toLocaleDateString('en-EN')
                }
            </p>
        </div>
    );
};
