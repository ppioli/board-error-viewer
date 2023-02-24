import { useFieldArray, useFormContext } from 'react-hook-form';
import { defaultComponent } from '../../model/Board';
import { ComponentTableRow } from './ComponentTableRow';
import { Virtuoso } from 'react-virtuoso';
import { forwardRef, useRef } from 'react';
import { useSizeObserver } from '../components/useSizeObserver';

export interface ComponentTableProps {
  name: string;
}
// do not inline the component, as a fresh instance would be created with each re-render
// if you need to do some conditional logic, use Virtuoso's context prop to pass props inside the Scroller
const Scroller: any = forwardRef(({ style, ...props }: any, ref) => {
  // an alternative option to assign the ref is
  // <div ref={(r) => ref.current = r}>
  return <div style={{ ...style, overflow: 'overlay', scrollbarGutter: 'stable' }} className={'frame'} ref={ref} {...props} />
})
export function ComponentTable({ name }: ComponentTableProps) {
  const { control } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `${name}.components`, // unique name for your Field Array
      keyName: 'fieldKey',
    }
  );
  const containerRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const size = useSizeObserver(containerRef)
  return (
    <div className={'d-flex flex-column'} style={{ height: '100%' }}>
      <div className={'h5'}>Components</div>
      <div className={'list-group border'} style={{height: '100%'}}>
        <div className={'list-group-item p-0'}>
          <div className={'d-flex justify-content-evenly align-items-end'}>
            <div className={'text-center flex-fill'}>
              ID
            </div>
            <div className={'text-center flex-fill'}>
              X
            </div>
            <div className={'text-center flex-fill'}>
              Y
            </div>
            <div
              className={'text-center'}
            >
              <button type={'button'} className={'btn btn-link invisible'}>
                <i className={'bi bi-three-dots'} />
              </button>
            </div>
          </div>
        </div>
        <div ref={containerRef} style={{ height: '100%' }}>
          {fields.length == 0 && (
            <div className={'list-group-item py-4 px-2 text-center'}>
              Empty list
            </div>
          )}
          {fields.length > 0 && (
            <Virtuoso
              height={size[1]}
              totalCount={fields.length}
              components={{ Scroller }}
              itemContent={(index) => {
                return (
                  <ComponentTableRow
                    key={fields[index].fieldKey}
                    index={index}
                    name={name}
                    onDelete={() => remove(index)}
                  />
                );
              }}
            />
          )}
        </div>
      </div>
      <button
        className={'btn btn-primary'}
        type={'button'}
        onClick={() => append(defaultComponent())}
      >
        <i className={'bi bi-plus'}/>
      </button>
    </div>
  );
}
