import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z, ZodTypeAny } from 'zod';

const initialState = {
  success: false,
  message: '',
};

interface Props<T extends ZodTypeAny> {
  action: (
    prevState: typeof initialState,
    formData: FormData,
  ) => Promise<typeof initialState>;
  schema: T;
  defaultFormValues: z.infer<T>;
}

export const useHookFormActionState = <T extends ZodTypeAny>({
  action,
  schema,
  defaultFormValues,
}: Props<T>) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, actionFn, isPending] = useActionState(action, initialState);

  // ✅ типы теперь совпадают
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const runAction = () => {
    if (!formRef.current) return;
    startTransition(() => {
      const formData = new FormData(formRef.current!);
      actionFn(formData);
    });
  };

  const onSubmit = form.handleSubmit(() => runAction());

  return { runAction, onSubmit, isPending, state, form, formRef };
};
