'use client';

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/hooks/use-modal-store';
import { ChevronDownIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EmojiPicker } from '@/components/emoji-picker';
import { useEffect, useRef, useState } from 'react';
import MemberSelectionModal from '../modals/message-block-modal';
import Modal from '@/lib/modal';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel';
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const serverId = query.serverId;
  const channelId = query.channelId;
  console.log('query is::::' + JSON.stringify(query));
  const dropdownRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('serverId in chat input is::::' + serverId);
        console.log('channelId in chat input is::::' + channelId);

        const response = await axios.get(
          `/api/members?serverId=${serverId}&channelId=${channelId}`
        ); 
        const list = response.data;
        console.log('response is::::' + JSON.stringify(response.data));

        setMembers(list);
        console.log('data is: ' + JSON.stringify(list));
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close the dropdown when clicking outside
        dropdownRef.current.selectedIndex = 0;
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    // Adjust dropdown positioning if it is at the bottom of the page
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      if (window.innerHeight - rect.bottom < 200) {
        dropdownRef.current.style.top = `-${rect.height}px`;
      } else {
        dropdownRef.current.style.top = '100%';
      }
    }
  }, [dropdownRef]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle selection of members in the modal
  const handleMemberSelection = (selectedMemberIds: string[]) => {
    setMemberIds(selectedMemberIds);
    console.log('selected members are: ' + JSON.stringify(selectedMemberIds));
    console.log('memberIds are in function: ' + JSON.stringify(memberIds));
    
    setIsModalOpen(false); // Close the modal after selection
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      console.log('memberIds are: ' + JSON.stringify(memberIds));
      
      const value_with_members = { ...values, memberIds };

      await axios.post(url, value_with_members);
      setMemberIds([]);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        { isDropdownOpen && members && members.length > 0 && (
                    <select
                      ref={dropdownRef}
                      className="absolute top-7 right-6 px-3 py-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 dark:text-gray-300"
                      defaultValue=""
                      multiple // Enable multiple selection
                      onChange={(e) => {
                        // Get selected options
                        const selectedOptions = Array.from(
                          e.target.selectedOptions
                        );
                        // Extract IDs of selected members
                        const selectedMemberIds = selectedOptions.map(
                          (option) => option.value
                        );
                        console.log(selectedMemberIds);
                        setMemberIds(selectedMemberIds);
                        // Perform action with selected member IDs
                      }}
                    >
                      <option value="" disabled hidden >
                        Select Members
                      </option>
                      {members.map((member) => (
                        <option  key={member.id} value={member.id}>
                          {member.profile.name}
                        </option>
                      ))}
                    </select>
                  )}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {
                      onOpen('messageFile', { apiUrl, query });
                    }}
                    className="absolute top-7 left-6  h-[24px] w-[22px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <div className="absolute top-7 left-12 ml-1 ">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                  <Input
                    disabled={isLoading}
                    className=" px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`  Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    {...field}
                  />
                  {type==='channel' && (
                  <button
                    type="button"
                    onClick={() => {
                      // setIsDropdownOpen(!isDropdownOpen)
                      setIsModalOpen(true);
                    }}
                    className="absolute top-7 right-6 text-gray-700 dark:text-gray-300 focus:outline-none"
                  >
                    <div className='flex'>
                    Block 
                    <ChevronDownIcon
                      className={`h-6 w-6 transform transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    </div>
                  </button>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
      {isModalOpen && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          {/* Pass the list of members and a function to handle selection */}
          <MemberSelectionModal
            members={members}
            onSelect={handleMemberSelection}
          />
        </Modal>
      )}
    </Form>
  );
};
