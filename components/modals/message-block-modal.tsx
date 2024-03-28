"use client"
import React, { useState } from 'react';


interface MemberSelectionModalProps {
  members: any;
  onSelect: (selectedMemberIds: string[]) => void;
}

const MemberSelectionModal = ({ members, onSelect }: MemberSelectionModalProps) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  console.log('members are: ' + JSON.stringify(members.map((member: any) => member.profile.name)));
  
  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleConfirmSelection = () => {
    onSelect(selectedMembers);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg text-blue-950 font-semibold mb-4">Select Members to Block</h2>
      <div className="space-y-2">
        {members.map((member: any) => (
          <div key={member.id} className="flex items-center">
            <input
              type="checkbox"
              id={`member-${member.id}`}
              value={member.id}
              checked={selectedMembers.includes(member.id)}
              onChange={() => handleToggleMember(member.id)}
              className="mr-2"
            />
            <p className='text-zinc-600 font-semibold'  >{member.profile.name}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirmSelection}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default MemberSelectionModal;
