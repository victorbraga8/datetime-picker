/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlarmClockCheck, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";

const formSchema = z.object({
  dateTime: z.date({ required_error: "Data e hora são obrigatórias." }),
  hour: z
    .number()
    .min(0, { message: "Hora deve ser entre 0 e 23." })
    .max(23, { message: "Hora deve ser entre 0 e 23." })
    .default(0),
  minute: z
    .number()
    .min(0, { message: "Minuto deve ser entre 0 e 59." })
    .max(59, { message: "Minuto deve ser entre 0 e 59." })
    .default(0),
  second: z
    .number()
    .min(0, { message: "Segundo deve ser entre 0 e 59." })
    .max(59, { message: "Segundo deve ser entre 0 e 59." })
    .default(0),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function DateTimePicker() {
  const { toast } = useToast();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { hour: 0, minute: 0, second: 0 },
  });

  const [time, setTime] = useState({ hour: "00", minute: "00", second: "00" });
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Estado para verificar se o calendário está aberto
  const isClearEnabled = Boolean(
    form.watch("dateTime") && time.hour && time.minute && time.second
  );

  const onSubmit = useCallback(
    (data: FormSchemaType) => {
      const formattedDate = format(data.dateTime, "yyyy-MM-dd", {
        locale: ptBR,
      });
      const formattedTime = `${time.hour}:${time.minute}:${time.second}`;
      toast({
        title: "Você enviou os seguintes valores:",
        description: (
          <pre>
            <code>
              {JSON.stringify(
                { data: formattedDate, horário: formattedTime },
                null,
                2
              )}
            </code>
          </pre>
        ),
      });
    },
    [time, toast]
  );

  const handleErrors = useCallback(
    (errors: any) => {
      Object.values(errors).forEach((error: any) =>
        toast({
          title: "Erro de Validação",
          description: error.message || "Erro desconhecido na validação.",
        })
      );
    },
    [toast]
  );

  useEffect(() => {
    form.setValue("hour", parseInt(time.hour));
    form.setValue("minute", parseInt(time.minute));
    form.setValue("second", parseInt(time.second));
  }, [time, form]);

  const handleTimeChange = useCallback((field: string, value: string) => {
    let newValue = parseInt(value);
    if (field === "hour") {
      newValue = newValue < 0 ? 23 : newValue > 23 ? 0 : newValue;
    } else if (field === "minute" || field === "second") {
      newValue = newValue < 0 ? 59 : newValue > 59 ? 0 : newValue;
    }
    setTime((prevTime) => ({
      ...prevTime,
      [field]: newValue.toString().padStart(2, "0"),
    }));
  }, []);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return; // Garante que 'date' não seja undefined
      const now = new Date();
      const brasiliaTime = set(now, {
        hours: now.getUTCHours() - 3,
        minutes: now.getUTCMinutes(),
        seconds: now.getUTCSeconds(),
      });

      form.setValue("dateTime", date);
      setTime({
        hour: brasiliaTime.getHours().toString().padStart(2, "0"),
        minute: brasiliaTime.getMinutes().toString().padStart(2, "0"),
        second: brasiliaTime.getSeconds().toString().padStart(2, "0"),
      });
    },
    [form]
  );

  const handleClear = useCallback(() => {
    form.reset({ dateTime: undefined, hour: 0, minute: 0, second: 0 });
    setTime({ hour: "00", minute: "00", second: "00" });
  }, [form]);

  // const handleCalendarOpen = () => {
  //   setIsCalendarOpen(true);
  // };

  // const handleCalendarClose = () => {
  //   setIsCalendarOpen(false);
  // };

  // Preenchimento automático da data e hora ao abrir o calendário:
  // useEffect(() => {
  //   if (isCalendarOpen && !form.watch("dateTime")) {
  //     const today = new Date();
  //     form.setValue("dateTime", today);
  //     setTime({
  //       hour: today.getHours().toString().padStart(2, "0"),
  //       minute: today.getMinutes().toString().padStart(2, "0"),
  //       second: today.getSeconds().toString().padStart(2, "0"),
  //     });
  //   }
  // }, [isCalendarOpen, form]);

  return (
    <Form {...form}>
      <form
        className="flex items-end gap-4 justify-center"
        onSubmit={form.handleSubmit(onSubmit, handleErrors)}
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }: any) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">DateTime</FormLabel>
              <Popover
              // onOpenChange={(open) =>
              //   open ? handleCalendarOpen() : handleCalendarClose()
              // }
              >
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        `${format(field.value, "P", {
                          locale: ptBR,
                        })} ${time.hour}:${time.minute}:${time.second}`
                      ) : (
                        <span>Escolha uma data e hora</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <div className="flex justify-center gap-2 items-center">
                      <AlarmClockCheck />
                      <FormControl>
                        <Input
                          type="number"
                          className="w-14"
                          value={time.hour}
                          onChange={(e) =>
                            handleTimeChange("hour", e.target.value)
                          }
                        />
                      </FormControl>
                      :
                      <FormControl>
                        <Input
                          type="number"
                          className="w-14"
                          value={time.minute}
                          onChange={(e) =>
                            handleTimeChange("minute", e.target.value)
                          }
                        />
                      </FormControl>
                      :
                      <FormControl>
                        <Input
                          type="number"
                          className="w-14"
                          value={time.second}
                          onChange={(e) =>
                            handleTimeChange("second", e.target.value)
                          }
                        />
                      </FormControl>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          disabled={!isClearEnabled}
        >
          Clear
        </Button>
      </form>
    </Form>
  );
}
