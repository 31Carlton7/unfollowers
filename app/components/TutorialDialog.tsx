'use client';

import ThreeDButton from './3DButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const TutorialDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <ThreeDButton text='How to use 🤔' />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>How to use unfollowers 🤔</DialogTitle>
        <DialogDescription asChild>
          <div>
            <p className='text-slate-500 mb-2 text-xs'>
              *NOTE*: When in the Instagram app, always check if the person doesn&apos;t follow you back. IG can
              sometimes return a list of users who actually do follow you back, making Unfollowers show you an
              incorrect unfollower.
            </p>
            {/* No lazy-load needed: Radix mounts dialog content only while open. */}
            <video src='/unfollowers-tutorial.mov' controls playsInline preload='metadata' className='w-full rounded-lg' />
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export default TutorialDialog;
