"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretSortIcon,
  CheckIcon,
  Cross2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Control, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverCloser,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { DatePickerWithRange } from "./ui/dateRangePicker";
import config from "@/lib/config.json";
import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

const EntrySchema = z.object({
  numberOfTransactions: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
  transactionType: z.enum(["Withdrawal", "Receiving", "Payment"]),
});

const FormSchema = z.object({
  tin: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "TIN must be a 10-digit number without special characters.",
  }),
  exchangeRate: z.coerce.number().min(1),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  bank: z.string({
    required_error: "Please select a bank.",
  }),
  branch: z.string({
    required_error: "Please select a branch.",
  }),
  accountNumber: z
    .string()
    .refine((value) => /^[a-zA-Z0-9]{1,15}$/.test(value), {
      message:
        "Account Number must be an alphanumeric value of length 15 or less without special characters.",
    }),
  returnStatus: z.string({
    required_error: "Please Choose a Return Status.",
  }),
  cardLoadingMobile: z.coerce.number().optional(),
  nonCardLoadingMobile: z.coerce.number().optional(),
  staffAirtimeMobile: z.coerce.number().optional(),
  contractAirtimeMobile: z.coerce.number().optional(),
  adjustmentsMobile: z.coerce.number().optional(),
  cardLoadingLandline: z.coerce.number().optional(),
  nonCardLoadingLandline: z.coerce.number().optional(),
  monthlyBillLandline: z.coerce.number().optional(),
  payphone: z.coerce.number().optional(),
  adjustmentsLandline: z.coerce.number().optional(),
  valueAddedServices: z.coerce.number().optional(),
  internationalCallsChargeable: z.coerce.number().optional(),
  internationalCallsExempt: z.coerce.number().optional(),
  withdrawalCharges: z.coerce.number().optional(),
  internatDataExempt: z.coerce.number().optional(),
  internatDataChargeable: z.coerce.number().optional(),
  financialServices: z.coerce.number().optional(),
  entries: z.array(EntrySchema),
});

interface FieldProps {
  control: Control<z.infer<typeof FormSchema>>;
  name: keyof z.infer<typeof FormSchema>;
  label: string;
  placeholder?: string;
}
interface MobileMoneyEntry {
  numberOfTransactions: number;
  amount: number;
  transactionType: "Withdrawal" | "Receiving" | "Payment";
}
interface MobileMoneyEntryProps {
  newEntry: MobileMoneyEntry;
  setNewEntry: React.Dispatch<React.SetStateAction<MobileMoneyEntry>>;
  append: (obj: MobileMoneyEntry) => void;
}
interface MobileMoneyEntryListProps {
  fields: any[];
  control: Control<z.infer<typeof FormSchema>>;
  remove: (index: number) => void;
}

export function InputField({ control, name, label, placeholder }: FieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/*@ts-ignore*/}
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function MobileMoneyEntry({
  newEntry,
  setNewEntry,
  append,
}: MobileMoneyEntryProps) {
  return (
    <div className="md:grid md:grid-cols-7 gap-8">
      <div className="col-span-2">
        <FormItem>
          <FormLabel>Number of transactions</FormLabel>
          <FormControl>
            <Input
              placeholder="Number of transactions"
              value={newEntry.numberOfTransactions}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  numberOfTransactions:
                    e.target.value === ""
                      ? 0
                      : isNaN(Number(e.target.value))
                      ? newEntry.numberOfTransactions
                      : parseInt(e.target.value),
                })
              }
            />
          </FormControl>
        </FormItem>
      </div>
      <div className="col-span-2">
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input
              placeholder="Amount"
              value={newEntry.amount}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  amount:
                    e.target.value === ""
                      ? 0
                      : isNaN(Number(e.target.value))
                      ? newEntry.amount
                      : parseFloat(e.target.value),
                })
              }
            />
          </FormControl>
        </FormItem>
      </div>
      <div className="col-span-2">
        <FormItem>
          <FormLabel>Transaction Type</FormLabel>
          <Select
            onValueChange={(value) =>
              setNewEntry({
                ...newEntry,
                transactionType: value as
                  | "Withdrawal"
                  | "Receiving"
                  | "Payment",
              })
            }
            value={newEntry.transactionType}
            defaultValue={newEntry.transactionType}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={newEntry.transactionType}
                  placeholder="Withdrawal, Receiving or Payment?"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {["Withdrawal", "Receiving", "Payment"].map(
                (returnType, index) => (
                  <SelectItem key={index} value={returnType}>
                    {returnType}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </div>
      <div className="col-span-1 flex items-end">
        <Button
          type="button"
          onClick={() => {
            append({
              numberOfTransactions: Number(newEntry.numberOfTransactions),
              amount: Number(newEntry.amount),
              transactionType: newEntry.transactionType as
                | "Withdrawal"
                | "Receiving"
                | "Payment",
            });
            setNewEntry({
              numberOfTransactions: 0,
              amount: 0,
              transactionType: "Withdrawal",
            });
          }}
        >
          <span className="hidden sm:inline">Add</span>
          <PlusIcon className="ml-2 h-5 w-5 sm:ml-0" />
        </Button>
      </div>
    </div>
  );
}

export function MobileMoneyEntryList({
  fields,
  control,
  remove,
}: MobileMoneyEntryListProps) {
  return (
    <div className="md:grid md:grid-cols-7 gap-8">
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <div className="col-span-2">
            <InputField
              control={control}
              name={
                `entries.${index}.numberOfTransactions` as keyof z.infer<
                  typeof FormSchema
                >
              }
              label="Number of transactions"
            />
          </div>
          <div className="col-span-2">
            <InputField
              control={control}
              name={
                `entries.${index}.amount` as keyof z.infer<typeof FormSchema>
              }
              label="Amount"
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={control}
              name={
                `entries.${index}.transactionType` as keyof z.infer<
                  typeof FormSchema
                >
              }
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  {/* @ts-ignore */}
                  <Select onValueChange={(v) => onChange(v)} value={value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Withdrawal, Receiving or Payment?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Withdrawal", "Receiving", "Payment"].map(
                        (returnType, index) => (
                          <SelectItem key={index} value={returnType}>
                            {returnType}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 flex items-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              <span className="hidden sm:inline">Delete</span>
              <TrashIcon className="ml-2 h-5 w-5 text-red-500 sm:ml-0" />
            </Button>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export function LedForm() {
  const [bankMenuOpen, setBankMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<MobileMoneyEntry>({
    numberOfTransactions: 0,
    amount: 0,
    transactionType: "Withdrawal",
  });
  const [selectedBank, setSelectedBank] = useState<BankType>(null);
  type BankType = { name: string; branches: string[] } | null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data));
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormDescription className="text-xl font-bold tracking-tight sm:text-2xl text-center">
          RETURN AND EXCHANGE RATE DETAILS
        </FormDescription>
        <div className="md:grid md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="tin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIN</FormLabel>
                <FormControl>
                  <Input
                    // disabled={loading}
                    placeholder="Enter TIN"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Return Period Date Range</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    dateRange={
                      value && value.from !== null && value.to !== null
                        ? value
                        : undefined
                    }
                    setDateRange={(dateRange) => onChange(dateRange)}
                    className=""
                  />
                </FormControl>
                {error && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
            name="dateRange"
            control={form.control}
          />
          <FormField
            control={form.control}
            name="exchangeRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dollar Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    // disabled={loading}
                    placeholder="3750"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription className="text-xl font-bold tracking-tight sm:text-2xl text-center">
          TAX PAYER INFORMATION
        </FormDescription>
        <div className="md:grid md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Bank Name</FormLabel>
                  <Popover open={bankMenuOpen} onOpenChange={setBankMenuOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value || "Select bank"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search bank..."
                          className="h-9"
                        />
                        <CommandEmpty>No bank found.</CommandEmpty>
                        <CommandGroup>
                          {config.bank.map((bank) => (
                            <CommandItem
                              value={bank.name}
                              key={bank.name}
                              onSelect={() => {
                                form.setValue("bank", bank.name);
                                //@ts-ignore
                                form.setValue("branch", null);
                                form.clearErrors("bank");
                                setSelectedBank(bank);
                                setBankMenuOpen(false);
                              }}
                            >
                              {bank.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  bank.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          {selectedBank && (
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <>
                  <FormItem className="flex flex-col justify-between">
                    <FormLabel>Branch</FormLabel>
                    <Popover
                      open={branchMenuOpen}
                      onOpenChange={setBranchMenuOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value || "Select branch"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search branch..."
                            className="h-9"
                          />
                          <CommandEmpty>No branch found.</CommandEmpty>
                          <CommandGroup>
                            {selectedBank.branches.map((branch: string) => (
                              <CommandItem
                                value={branch}
                                key={branch}
                                onSelect={() => {
                                  form.setValue("branch", branch);
                                  form.clearErrors("branch");
                                  setBranchMenuOpen(false);
                                }}
                              >
                                {branch}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    branch === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                      {/* <PopoverCloser className="font-family-inherit rounded-full h-25 w-25 inline-flex items-center justify-center text-violet-11 absolute top-5 right-5">
                        <Cross2Icon />
                      </PopoverCloser> */}
                    </Popover>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    // disabled={loading}
                    placeholder="Enter Account Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="returnStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Filing Status</FormLabel>
                <Select
                  // disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Original or Amended?"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {config.returnStatus.map((returnType, index) => (
                      <SelectItem key={index} value={returnType}>
                        {returnType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription className="text-xl font-bold tracking-tight sm:text-2xl text-center">
          EXCISE DUTY ON SERVICES
        </FormDescription>
        <FormDescription className="text-base sm:text-lg font-bold uppercase text-center">
          Airtime on Mobile
        </FormDescription>
        <div className="md:grid md:grid-cols-3 gap-8">
          {[
            {
              name: "cardLoadingMobile",
              label: "Card Loading (Prepaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "nonCardLoadingMobile",
              label: "Non Card Loading (Prepaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "staffAirtimeMobile",
              label: "Staff Airtime (Postpaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "contractAirtimeMobile",
              label: "Contract Airtime (Postpaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "adjustmentsMobile",
              label: "Adjustments (Mobile)",
              placeholder: "Value in UGX",
            },
          ].map((field) => (
            <InputField
              key={field.name}
              control={form.control}
              name={field.name as keyof z.infer<typeof FormSchema>}
              label={field.label}
              placeholder={field.placeholder}
            />
          ))}
        </div>
        <FormDescription className="text-base sm:text-lg font-bold uppercase text-center">
          Landline and Payphone Services
        </FormDescription>
        <div className="md:grid md:grid-cols-3 gap-8">
          {[
            {
              name: "cardLoadingLandline",
              label: "Card Loading - Landline (Prepaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "nonCardLoadingLandline",
              label: "Non Card Loading - Landline (Prepaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "monthlyBillLandline",
              label: "Monthly Billing (Postpaid)",
              placeholder: "Value in UGX",
            },
            {
              name: "payphone",
              label: "Payphone",
              placeholder: "Value in UGX",
            },
            {
              name: "adjustmentsLandline",
              label: "Adjustments (Landline)",
              placeholder: "Value in UGX",
            },
          ].map((field) => (
            <InputField
              key={field.name}
              control={form.control}
              name={field.name as keyof z.infer<typeof FormSchema>}
              label={field.label}
              placeholder={field.placeholder}
            />
          ))}
        </div>
        <FormDescription className="text-base sm:text-lg font-bold uppercase text-center">
          Other Telecom Services
        </FormDescription>
        <div className="md:grid md:grid-cols-3 gap-8">
          {[
            {
              name: "valueAddedServices",
              label: "Value Added Services",
              placeholder: "Value in UGX",
            },
            {
              name: "internationalCallsChargeable",
              label: "International Calls (Chargeable)",
              placeholder: "Enter Number of Minutes",
            },
            {
              name: "internationalCallsExempt",
              label: "Exempt International Calls",
              placeholder: "Enter Number of Minutes",
            },
            {
              name: "withdrawalCharges",
              label: "Money Transfer & Withdrawal",
              placeholder: "Value in UGX",
            },
            {
              name: "internetDataExempt",
              label: "Exempt Internet Data (Medical & Education)",
              placeholder: "Value in UGX",
            },
            {
              name: "internetDataChargeable",
              label: "Internet Data (Chargeable)",
              placeholder: "Value in UGX",
            },
            {
              name: "financialServices",
              label: "Financial Services",
              placeholder: "Value in UGX",
            },
          ].map((field) => (
            <InputField
              key={field.name}
              control={form.control}
              name={field.name as keyof z.infer<typeof FormSchema>}
              label={field.label}
              placeholder={field.placeholder}
            />
          ))}
        </div>
        <FormDescription className="text-xl font-bold tracking-tight sm:text-2xl text-center uppercase">
          Mobile Money Transactions
        </FormDescription>
        <MobileMoneyEntryList
          fields={fields}
          control={form.control}
          remove={remove}
        />
        {/* Add Entry */}
        <MobileMoneyEntry
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          append={append}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
