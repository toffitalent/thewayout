#!/bin/bash

awslocal sqs create-queue --queue-name tasks.fifo --attributes FifoQueue=true
