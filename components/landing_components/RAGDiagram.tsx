import React from 'react';
import Image from 'next/image';
import { Break } from '../ui/break';


export const RAGDiagram = () => {

  return (
    <section className="
    flex flex-1 flex-col gap-5
    mb-10 mt-10
    px-15
    ">

      {/* Document Uploading */}
      <div className="flex w-full h-60">

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Document Uploading
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            Documents are uploaded and received by the system, where they are prepared for preprocessing and chunking.
            Document pans away and a loading scroll comes and then a cloud comes with a tick on it
          </p>
        </div>

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden ml-5">
          <Image
            src="/file_upload.gif"
            alt="file_upload"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <Break />

      {/* Chunking */}
      <div className="flex w-full h-60">

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden">
          <Image
            src="/chunking.gif"
            alt="chunking"
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Chunking
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            The documents are split into smaller, overlapping chunks to preserve semantic meaning while fitting within model context limits.
          </p>
        </div>
      </div>

      <Break />

      {/* Embedding */}
      <div className="flex w-full h-60">

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Embedding
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            Each chunk is converted into an embedding, a numerical vector representation that captures semantic relationships, enabling similarity based comparison.
          </p>
        </div>

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden ml-5">
          <Image
            src="/embedding.gif"
            alt="embedding"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <Break />

      {/* Storing */}
      <div className="flex w-full h-60">

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden">
          <Image
            src="/storing.gif"
            alt="storing"
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Storing
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            the embeddings of the chunks are stored in a Vector Database which is a specialized database made specifically for large embedding vectors.
          </p>
        </div>
      </div>

      <Break />

      {/* Querying */}
      <div className="flex w-full h-60">

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Querying
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            When a query is recieved by an LLM, it is embedded and passed to the retriever.
          </p>
        </div>

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden">
          <Image
            src="/querying.gif"
            alt="querying"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <Break />

      {/* Retrieving similar chunks */}
      <div className="flex w-full h-60">

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden">
          <Image
            src="/retrieving.gif"
            alt="retrieving"
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Retrieving similar chunks
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            The embedded query is scanned thruout the database inorder to find the top K similar chunks to it. They hold the information the query is asking for.
          </p>
        </div>
      </div>

      <Break />

      {/* Prompt modification */}
      <div className="flex w-full h-60">

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Prompt modification
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            Now with the original query and similar chunks of information retrieved, an advanced prompt it made which consists of :
            The Instructions,
            The Context (retrieved chunks) and
            The Question (original query)
          </p>
        </div>

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden ml-5">
          <Image
            src="/prompt modification.gif"
            alt="prompt modification"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <Break />

      {/* Response Generation */}
      <div className="flex w-full h-60">

        {/* Image */}
        <div className="relative  w-[25%] h-full overflow-hidden">
          <Image
            src="/generation.gif"
            alt="generation"
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Description */}
        <div className="
        flex flex-col 
        bg-gray-200 w-[75%]
        border-4 border-purple-400 border-dashed
        rounded-2xl
        
        transition-transform duration-300 ease-out
        hover:scale-[1.03]">
          <h3 className="text-2xl font-bold mx-10 mt-10">
            Response Generation
          </h3>
          <p className="text-xl font-light mx-10 my-5">
            The final prompt is sent to the LLM to generate a response grounded in retrieved context, significantly reducing hallucinations, improving factual reliability and confidence in the response.
          </p>
        </div>
      </div>

    </section>
  );
}

