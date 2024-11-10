"use client";

import { format } from "date-fns";
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
import { useState, useEffect } from "react";

const formSchema = z.object({
  dateTime: z.date(),
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  second: z.number().min(0).max(59),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function DateTimePicker() {
  const { toast } = useToast();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hour: 0,
      minute: 0,
      second: 0,
    },
  });

  const [time, setTime] = useState({ hour: "00", minute: "00", second: "00" });

  function onSubmit(data: FormSchemaType) {
    const fullDate = data.dateTime;
    const formattedDate = format(fullDate, "yyyy-MM-dd", { locale: ptBR });
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
  }

  useEffect(() => {
    form.setValue("hour", parseInt(time.hour));
    form.setValue("minute", parseInt(time.minute));
    form.setValue("second", parseInt(time.second));
  }, [time, form]);

  const handleTimeChange = (field: string, value: string) => {
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
  };

  return (
    <Form {...form}>
      <form
        className="flex items-end gap-4 justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }: any) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">DateTime</FormLabel>
              <Popover>
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
                        `${format(field.value, "P", { locale: ptBR })} ${
                          time.hour
                        }:${time.minute}:${time.second}`
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
                    onSelect={field.onChange}
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
      </form>
    </Form>
  );
}
