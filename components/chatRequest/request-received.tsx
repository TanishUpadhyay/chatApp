import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
  

export default function RequestSent({ onRequestReceived }: { onRequestReceived: any }) {

    const FormSchema = z.object({
        type: z.enum(["Yes", "No"], {
          required_error: "You need to select a notification type.",
        }),
      });
        const form = useForm({
            resolver: zodResolver(FormSchema),
        });
    return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onRequestReceived)} className="w-2/3 space-y-6">
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Do you want to accept this conversation?</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                        Yes
                        </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="No" />
                        </FormControl>
                        <FormLabel className="font-normal">
                        No
                        </FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Submit</Button>
        </form>
        </Form>
    );
          }