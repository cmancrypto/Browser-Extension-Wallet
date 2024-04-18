import { Select, SelectValue } from '@radix-ui/react-select';
import { NavLink } from 'react-router-dom';

import { LogoIcon } from '@/assets/icons';
import { ReceiveDialog } from '@/components';
import { ROUTES } from '@/constants';
import {
  Button,
  ScrollArea,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from '@/ui-kit';

const EXAMPLE_ASSETS = [1, 2, 3, 4, 5, 6, 7, 8];

export const Main = () => (
  <div className="h-full pt-5">
    <div className="flex gap-x-6 px-4">
      <div className="text-left">
        <label className="text-sm text-neutral-1">Account 1</label>
        <Select defaultValue="1ZChms...HVDzw">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1ZChms...HVDzw">1ZChms...HVDzw</SelectItem>
            <SelectSeparator />
            <SelectItem value="1ZChms...HbHe1">1ZChms...HbHe1</SelectItem>
            <SelectSeparator />
            <SelectItem value="1ZChms...H24Kvh">1ZChms...H24Kvh</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-left">
        <label className="text-sm text-neutral-1 mb-0.5">Network</label>
        <Select defaultValue="symphony">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="symphony">Symphony</SelectItem>
            <SelectSeparator />
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectSeparator />
            <NavLink
              to={ROUTES.APP.ADD_NETWORK}
              className="flex text-blue font-normal hover:text-blue-dark py-2 px-2.5 focus:outline-0"
            >
              Add new network
            </NavLink>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="px-4 mt-4">
      <div className="p-4 border rounded-xl border-neutral-4 flex flex-col items-center">
        <div className="text-center mb-7">
          <p className="text-base text-neutral-1">Available balance</p>
          <h1 className="text-h2 text-white font-bold">$1504.94</h1>
        </div>
        <div className="grid grid-cols-2 w-full gap-x-4 px-2">
          <ReceiveDialog />
          <Button className="w-full" asChild>
            <NavLink to={ROUTES.APP.SEND}>Send</NavLink>
          </Button>
        </div>
      </div>
    </div>
    <div className="text-left pt-4">
      <h3 className="text-h4 text-white font-bold px-4">Assets</h3>
      <ScrollArea
        className="h-[200px] w-full mt-3"
        type="always"
        scrollbarProps={{
          className: 'max-h-[93%]',
        }}
      >
        {EXAMPLE_ASSETS.map(item => (
          <div
            key={item}
            className="mx-4 py-2 min-h-[52px] flex items-center not-last:border-b not-last:border-neutral-4"
          >
            <div className="rounded-full h-9 w-9 bg-neutral-2 p-2 flex items-center justify-center">
              <LogoIcon />
            </div>
            <div className="flex flex-col ml-3">
              <h6 className="text-base text-white">Melody</h6>
              <p className="text-xs text-neutral-1">20456 MLD</p>
            </div>
            <div className="flex-1" />
            <div className="text-white text-h6">$1504.94</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  </div>
);
