import { Task } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import useStore from "../store";
import { EditedTask } from "../types";

export const useMutateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const reset = useStore((state) => state.resetEditedTask);

  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, "id">) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task
      );

      return res.data;
    },
    {
      onSuccess: (res) => {
        const previousTask = queryClient.getQueryData<Task[]>([`tasks`]);
        if (previousTask) {
          queryClient.setQueryData([`tasks`], [res, ...previousTask]);
        }
        reset();
      },
      onError: (error: any) => {
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task
      );

      return res.data;
    },
    {
      onSuccess: (res) => {
        const previousTask = queryClient.getQueryData<Task[]>([`tasks`]);
        if (previousTask) {
          queryClient.setQueryData(
            ["tasks"],
            previousTask.map((task) => (task.id === res.id ? res : task))
          );
        }
        reset();
      },
      onError: (error: any) => {
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`);
    },
    {
      onSuccess: (_, variables) => {
        const previousTask = queryClient.getQueryData<Task[]>([`tasks`]);
        if (previousTask) {
          queryClient.setQueryData(
            ["tasks"],
            previousTask.filter((task) => task.id !== variables)
          );
        }
        reset();
      },
      onError: (error: any) => {
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};
