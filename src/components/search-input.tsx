import { Close } from 'src/components/ui'
import { cn } from 'src/lib/utils'
import type { FieldValues, Path, PathValue, UseFormRegister, UseFormSetValue } from 'react-hook-form'

interface SearchInputProps<T extends FieldValues> {
  name: Path<T>
  register: UseFormRegister<T>
  setValue: UseFormSetValue<T>
  value: string
  placeholder?: string
}

export function SearchInput<T extends FieldValues> ({
  name,
  register,
  setValue,
  value,
  placeholder = 'Buscar...'
}: SearchInputProps<T>) {
  return (
    <div className="relative rounded h-12 overflow-hidden border-2 border-border focus-within:border-foreground">
      <input
        type="text"
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          'w-full px-4 pr-12 h-full ring-0 outline-none focus:outline-none focus:ring-0'
        )}
      />
      {value.length > 0 && (
        <Close
          className="absolute top-1/2 right-2 -translate-y-1/2"
          onClick={() => setValue(name, '' as PathValue<T, Path<T>>)}
        />
      )}
    </div>
  )
}
