import { Ref, ref, reactive, isRef, isReactive, watch, onUnmounted } from "vue";

interface WatchFieldsOptions {
  debounceDelay?: number;
  immediate?: boolean;
}

interface FieldChange<T = any> {
  newValue: T;
  oldValue: T;
}

interface FieldChangeMap {
  [field: string]: FieldChange;
}

interface WatchFieldsData<TState extends object> {
  changedFields: string[];
  fields: (keyof TState)[] | string[];
  fieldChangeMap: FieldChangeMap;
}

type WatchFieldsListener<TState extends object> = (data: WatchFieldsData<TState>) => void;

export function useWatchFields<TState extends object>(
  state: TState,
  fields: (keyof TState)[] | string[],
  options: WatchFieldsOptions = { debounceDelay: 300, immediate: false }
): { onChange: (listener: WatchFieldsListener<TState>) => void } {
  interface WatchFieldsData {
    changedFields: string[];
    fields: (keyof TState)[] | string[];
    fieldChangeMap: FieldChangeMap;
  }
  const listeners: Ref<WatchFieldsListener<TState>[]> = ref<WatchFieldsListener<TState>[]>([]);
  let debounceTimeout: number | null = null;

  const trigger = (data: WatchFieldsData) => {
    listeners.value.forEach((listener) => {
      listener(data);
    });
  };

  const debouncedTrigger = (data: WatchFieldsData) => {
    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      trigger(data);
    }, options.debounceDelay) as unknown as number;
  };

  watch(
    () =>
      fields.map((field) => {
        if (isRef(state)) {
          return (state as Ref<Record<string, any>>).value[field as string];
        } else if (isReactive(state)) {
          return (state as Record<string, any>)[field as string];
        }
        return undefined;
      }),
    (newValues, oldValues) => {
      const changedFields: string[] = [];
      const fieldChangeMap: FieldChangeMap = {};

      newValues.forEach((newValue, index) => {
        const field = fields[index] as string;
        const oldValue = oldValues ? oldValues[index] : null;

        if (newValue !== oldValue) {
          changedFields.push(field);
          fieldChangeMap[field] = { newValue, oldValue };
        }
      });

      if (changedFields.length > 0) {
        const data: WatchFieldsData = {
          changedFields,
          fields,
          fieldChangeMap
        };

        if (options.debounceDelay && options.debounceDelay > 0) {
          debouncedTrigger(data);
        } else {
          trigger(data);
        }
      }
    },
    { deep: true, immediate: options.immediate }
  );

  onUnmounted(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  });

  return {
    onChange: (listener: WatchFieldsListener<TState>) => {
      listeners.value.push(listener);
    }
  };
}
