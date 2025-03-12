import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSongSchema, type UploadSong } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UploadDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UploadSong & { audio: FileList | null; cover: FileList | null }>({
    resolver: zodResolver(uploadSongSchema),
    defaultValues: {
      title: "",
      artist: "",
      audio: null,
      cover: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("Submitting form data:", {
        title: formData.get('title'),
        artist: formData.get('artist'),
        audio: formData.get('audio'),
        cover: formData.get('cover'),
      });

      const res = await fetch("/api/songs", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload song");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      setOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Song uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UploadSong & { audio: FileList | null; cover: FileList | null }) => {
    const audioFile = data.audio?.[0];
    const coverFile = data.cover?.[0];

    if (!audioFile || !coverFile) {
      toast({
        title: "Error",
        description: "Please select both audio and cover files",
        variant: "destructive",
      });
      return;
    }

    console.log("Preparing form data with files:", {
      audio: audioFile.name,
      cover: coverFile.name,
    });

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("artist", data.artist);
    formData.append("audio", audioFile);
    formData.append("cover", coverFile);

    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Song</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a new song</DialogTitle>
          <DialogDescription>
            Add your song to your library. Choose a song file and a cover image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Song title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input placeholder="Artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audio"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Audio File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        console.log("Audio file selected:", e.target.files?.[0]?.name);
                        onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cover"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log("Cover file selected:", e.target.files?.[0]?.name);
                        onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}